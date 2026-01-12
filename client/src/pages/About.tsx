import { motion } from "framer-motion";
import { FreeQuoteModal } from "@/components/FreeQuoteModal";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users, Shield, Briefcase, Building2, CheckCircle2, MapPin, Rocket, Sparkles } from "lucide-react";
import { navigate } from "wouter/use-browser-location";
import { InteractiveMap } from "@/components/InteractiveMap";
export default function About() {
  const strengths = [
    { title: "Technical Expertise", desc: "Strong technical knowledge and collective team experience." },
    { title: "Turnkey EPC", desc: "Comprehensive engineering, procurement, and construction." },
    { title: "Strategic Liaisoning", desc: "Expertise in land liaisoning and project identification." },
    { title: "10+ Yrs Experience", desc: "Cumulative expertise in solar, electrical, and thermal power." }
  ];

  const services = [
    "Consultancy for Open Access solar, electrical project land Liaisoning",
    "Solar Power Plant Design & Engineering",
    "Turnkey Solar Power Plant EPC",
    "Solar Plant operations and maintenance (Rooftop & Ground Mount)",
    "Consultancy for Project financing for PPA and EMI projects"
  ];

  const groupCompanies = [
    "Swayog Consultancy Services",
    "Swayog Energy Pvt. Ltd.",
    "Swayog Wattfin JV Pvt Ltd",
    "Wattfin Ventures Pvt Ltd, Nagpur"
  ];

  const teamMembers = [
    { name: "Yogesh G. Tayade", role: "Proprietor & Technical Head", image: "/images/img1.jpeg" },
    { name: "Gokul Girdhar", role: "Senior Engineer", image: "/images/gokul girdhar.jpeg" },
    { name: "Balaji", role: "Project Manager", image: "/images/balaji.jpeg" },
    { name: "Project Management Team", role: "Solar & Thermal Experts", image: "/images/img2.jpeg" },
    { name: "Installation Team", role: "Skilled Technicians", image: "/images/com.jpeg" },
    { name: "Technical Team", role: "Engineering Specialists", image: "/images/WhatsApp Image 2025-07-21 at 11.26.34.jpeg" }
  ];

  const locations = [
    { city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
    { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
    { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
    { city: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
    { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
    { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
    { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/industrial.jpg')] bg-cover bg-center opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-display font-bold mb-6"
          >
            Swayog Consultancy Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-3xl mx-auto font-medium"
          >
            Complete Solar Energy and Electrical Solutions Under One Roof.
          </motion.p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">About Our Company</span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 md:mb-8 text-gray-900 leading-tight">
                Expert Solutions for a Sustainable Future
              </h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Swayog Consultancy Services is honored to introduce itself as a company that brings complete Solar energy and electrical solutions under one roof. We provide Solar Energy and electrical Solutions, on turnkey basis or only for selective scope of work for small as well as utility scale projects.
                </p>
                <p>
                  Established in year 2017, we have installed around 25 MW+ of solar projects. Our team consists of expert engineers, technicians, and consultants with cumulative 25+ years of experience in solar energy, electrical, thermal power, and other industries.
                </p>
              </div>
              <div className="mt-8 md:mt-10 flex flex-wrap gap-6 md:gap-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-secondary">25+ MW</span>
                  <span className="text-gray-500 font-medium">Solar Installed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-secondary">10+</span>
                  <span className="text-gray-500 font-medium">Years Collective Exp</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full max-w-xl mx-auto"
            >
              <div className="aspect-[4/4] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/handShake.png" 
                  alt="Solar Site" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                <Sparkles className="h-6 w-6 text-primary mb-3" />
                <p className="text-gray-900 font-bold italic text-base leading-snug">
                  "Working closely with society to make solar energy economical for everyone."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Swayog Consultancy Services designs, develops, maintains and deploys Solar PV technology to produce high-value electricity for the betterment of mankind.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Continuously work to make the solar energy economical for Society.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-12 md:mb-16">Our Core Strengths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {strengths.map((s, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/50 transition-colors text-center group">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-xl mb-3">{s.title}</h4>
                <p className="text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Meet Our Expert Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of 30+ experienced professionals manages project execution with maximum efficiency and technical excellence.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="relative mb-4">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-primary transition-colors">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="text-base md:text-lg font-bold mb-1">{member.name}</h4>
                  <p className="text-sm md:text-base text-primary font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">Our Presence in India</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Headquartered in Nagpur, providing turnkey solar solutions across the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            
            {/* Map Column */}
            <div className="lg:col-span-7 z-0 overflow-hidden rounded-3xl">
               <InteractiveMap locations={locations} />
            </div>

            {/* List Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="text-primary h-5 w-5" />
                  Regional Centers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {locations.map((loc, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{loc.city}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{loc.state}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-primary rounded-2xl text-white">
                  <p className="text-3xl font-bold">25+</p>
                  <p className="text-xs uppercase opacity-80">MW Installed</p>
                </div>
                <div className="p-6 bg-secondary rounded-2xl text-white">
                  <p className="text-3xl font-bold">30+</p>
                  <p className="text-xs uppercase opacity-80">Experts</p>
                </div>
              </div>
              
              <p className="text-gray-500 italic text-sm px-2">
                * We are rapidly expanding. Our team is capable of executing projects in any state across India.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Services & Group Companies */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-secondary text-white p-12 rounded-[2rem] shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <Briefcase className="h-8 w-8 text-primary" />
                <h3 className="text-3xl font-bold">Our Services</h3>
              </div>
              <ul className="space-y-4">
                {services.map((service, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg opacity-90">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div id="companies" className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <Building2 className="h-8 w-8 text-primary" />
                <h3 className="text-3xl font-bold">Group Companies</h3>
              </div>
              <ul className="space-y-6">
                {groupCompanies.map((company, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl font-semibold text-gray-800">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {company}
                  </li>
                ))}
              </ul>
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-600 italic">
                  "Working together across different portfolios to provide the best support for solar power projects nationwide."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-8">
            Ready to Switch to Solar?
          </h2>
          <FreeQuoteModal>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-xl px-12 h-16 rounded-full font-bold shadow-2xl">
              Get Your Free Quote Today
            </Button>
          </FreeQuoteModal>
        </div>
      </section>
    </div>
  );
}
