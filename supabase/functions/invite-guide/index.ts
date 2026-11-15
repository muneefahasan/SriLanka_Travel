
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    // 1. Allow POST requests only
    if (req.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    // 2. Verify logged-in user
    const userId = ctx.userClaims?.id;

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Verify admin role
    const { data: profile, error: profileError } =
      await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    if (profileError) {
      console.error("Admin verification failed:", profileError);

      return Response.json(
        { error: "Unable to verify administrator" },
        { status: 500 }
      );
    }

    if (profile?.role !== "admin") {
      return Response.json(
        { error: "Only admins can invite guides" },
        { status: 403 }
      );
    }

    // 4. Read and validate request body
    const body = await req.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const requiredFields = [
      "full_name",
      "email",
      "phone",
      "district",
      "address",
      "license_number",
    ];

    const clean: Record<string, string> = {};

    for (const field of requiredFields) {
      const value = input[field];

      if (typeof value !== "string" || !value.trim()) {
        return Response.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }

      clean[field] = value.trim();
    }

    // 5. Normalize values
    const fullName = clean.full_name;
    const cleanEmail = clean.email.toLowerCase();
    const cleanPhone = clean.phone;
    const district = clean.district;
    const address = clean.address;
    const cleanLicense = clean.license_number;

    // 6. Validate field lengths
    if (
      fullName.length > 150 ||
      cleanEmail.length > 254 ||
      cleanPhone.length > 30 ||
      district.length > 100 ||
      address.length > 500 ||
      cleanLicense.length > 100
    ) {
      return Response.json(
        { error: "One or more fields exceed the allowed length" },
        { status: 400 }
      );
    }

    // 7. Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return Response.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // 8. Check existing guide license and phone
    const { data: existingGuides, error: duplicateCheckError } =
      await ctx.supabase
        .from("profiles")
        .select("license_number, phone")
        .eq("role", "guide");

    if (duplicateCheckError) {
      console.error("Guide duplicate check failed:", duplicateCheckError);

      return Response.json(
        { error: "Unable to validate guide details" },
        { status: 500 }
      );
    }

    const normalizedLicense = cleanLicense.toLowerCase();
    const normalizedPhone = cleanPhone;

    const duplicateLicense = existingGuides?.some(
      (guide) =>
        typeof guide.license_number === "string" &&
        guide.license_number.trim().toLowerCase() === normalizedLicense
    );

    if (duplicateLicense) {
      return Response.json(
        { error: "This license number is already registered" },
        { status: 409 }
      );
    }

    const duplicatePhone = existingGuides?.some(
      (guide) =>
        typeof guide.phone === "string" &&
        guide.phone.trim() === normalizedPhone
    );

    if (duplicatePhone) {
      return Response.json(
        { error: "This phone number is already registered" },
        { status: 409 }
      );
    }

    // 9. Send guide invitation
    const { data: invitationData, error: inviteError } =
      await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(
        cleanEmail,
        {
          data: {
            role: "guide",
            full_name: fullName,
            phone: cleanPhone,
            district: district,
            address: address,
            license_number: cleanLicense,
          },
          redirectTo: "http://localhost:5173/",
        }
      );

    // 10. Handle invitation errors
    if (inviteError) {
      const errorMessage = inviteError.message.toLowerCase();

      if (
        errorMessage.includes("already") ||
        errorMessage.includes("registered") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("unique constraint")
      ) {
        return Response.json(
          { error: "This email or guide detail is already registered" },
          { status: 409 }
        );
      }

      console.error("Guide invitation failed:", inviteError.message);

      return Response.json(
        { error: "Unable to send guide invitation" },
        { status: 500 }
      );
    }

    // 11. Return success
    return Response.json({
      message: "Guide invitation sent successfully",
      email: cleanEmail,
      user_id: invitationData.user?.id,
    });
  }),
};
