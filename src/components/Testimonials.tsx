import { Container } from '@/components/ui/container';
import { TestimonialHeader } from './testimonials/TestimonialHeader';
import { TestimonialCard } from './testimonials/TestimonialCard';
import avatarImage1 from '@/images/avatars/avatar-1.png';
import avatarImage2 from '@/images/avatars/avatar-2.png';
import avatarImage3 from '@/images/avatars/avatar-3.png';
import avatarImage4 from '@/images/avatars/avatar-4.png';
import avatarImage5 from '@/images/avatars/avatar-5.png';

const testimonials = [
  {
    key: 'montreal',
    image: avatarImage1,
  },
  {
    key: 'laval',
    image: avatarImage4,
  },
  {
    key: 'sherbrooke',
    image: avatarImage5,
  },
  {
    key: 'gatineau',
    image: avatarImage2,
  },
  {
    key: 'quebec',
    image: avatarImage3,
  },
  {
    key: 'troisrivieres',
    image: avatarImage4,
  }
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <TestimonialHeader />
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <li 
              key={index} 
              className={`animate-fade-in ${
                index >= 3 ? 'hidden lg:block' : ''
              }`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <TestimonialCard 
                testimonialKey={testimonial.key}
                image={testimonial.image}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}