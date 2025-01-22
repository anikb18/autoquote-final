import { Container } from '@/components/ui/container';
import { TestimonialHeader } from './testimonials/TestimonialHeader';
import { TestimonialCard } from './testimonials/TestimonialCard';
import avatarImage1 from '/public/images/avatars/avatar-1.png';
import avatarImage2 from '/public/images/avatars/avatar-2.png';
import avatarImage3 from '/public/images/avatars/avatar-3.png';
import avatarImage4 from '/public/images/avatars/avatar-4.png';
import avatarImage5 from '/public/images/avatars/avatar-5.png';

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
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <li key={index} className={index >= 3 ? 'hidden lg:block' : ''}>
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