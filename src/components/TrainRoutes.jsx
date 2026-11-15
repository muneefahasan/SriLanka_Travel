
import { Train, Bus, ExternalLink, Search, Ticket } from 'lucide-react';
import SplitHeading from './SplitHeading';

const transportServices = [
  {
    id: 'train',
    title: 'Sri Lanka Railway Services',
    description:
      'Explore official railway schedules and access online seat reservations through Sri Lanka Railways.',
    icon: Train,
    links: [
      {
        label: 'Search Train Timetable',
        url: 'https://eservices.railway.gov.lk/schedule/searchTrain.action?lang=en',
        icon: Search,
      },
      {
        label: 'Reserve Train Seats',
        url: 'https://seatreservation.railway.gov.lk/',
        icon: Ticket,
      },
    ],
  },
  {
    id: 'bus',
    title: 'Public Bus Services',
    description:
      'Access official bus timetable information and online seat reservation services.',
    icon: Bus,
    links: [
      {
        label: 'Bus Timetable',
        url: 'https://ntc.gov.lk/times/',
        icon: Search,
      },
      {
        label: 'SLTB Online Booking',
        url: 'https://sltb.eseat.lk/',
        icon: Ticket,
      },
    ],
  },
];

export default function TrainRoutes() {
  return (
    <section
      id="transport"
      className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <SplitHeading
            as="h2"
            className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-4"
          >
            Sri Lanka Transport
          </SplitHeading>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Find official railway and bus timetable information and access
            online booking services through the links below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {transportServices.map((service) => {
            const ServiceIcon = service.icon;

            return (
              <div
                key={service.id}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-emerald-500/50 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <ServiceIcon size={28} className="text-emerald-400" />
                </div>

                <h3 className="text-2xl font-editorial font-extrabold text-white mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="mt-auto space-y-3">
                  {service.links.map((link) => {
                    const LinkIcon = link.icon;

                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between gap-3 bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/30 px-5 py-4 rounded-xl text-sm font-bold text-white transition-all"
                      >
                        <span className="flex items-center gap-3">
                          <LinkIcon
                            size={18}
                            className="text-emerald-400"
                          />
                          {link.label}
                        </span>

                        <ExternalLink
                          size={16}
                          className="text-slate-400"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Timetables, availability and reservations are managed by the
          respective official transport service providers.
        </p>
      </div>
    </section>
  );
}
