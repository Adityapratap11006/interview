import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'PrepPilot made my revision feel structured and calm. I finally have a system that keeps me moving.',
    name: 'Aarav M.',
    role: 'SDE Intern Candidate',
  },
  {
    quote: 'The analytics and mock interview flow were the missing piece in my prep. Everything feels premium.',
    name: 'Nisha K.',
    role: 'Product Engineer Aspirant',
  },
  {
    quote: 'The AI hints felt thoughtful and useful. I studied with more focus and less friction.',
    name: 'Rohan P.',
    role: 'Placement Prep Student',
  },
]

function Testimonials() {
  return (
    <section className="py-8 sm:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Loved by ambitious learners</p>
        <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">A refined experience for serious prep.</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl"
          >
            <p className="text-sm leading-8 text-slate-300">“{item.quote}”</p>
            <div className="mt-6">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-slate-500">{item.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
