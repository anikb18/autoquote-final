import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureImageProps {
  image: string;
  isActive: boolean;
  className?: string;
}

export const FeatureImage = ({ image, isActive, className }: FeatureImageProps) => {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-slate-50', className)}>
      <motion.img
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: isActive ? 1 : 0.5,
          scale: isActive ? 1 : 1.1,
        }}
        transition={{ duration: 0.4 }}
        className="w-full"
        src={image}
        alt=""
        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
      />
    </div>
  );
};