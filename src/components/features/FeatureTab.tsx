import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FeatureTabProps {
  feature: {
    name: string;
    summary: string;
    description: string;
    icon: React.ComponentType;
  };
  isActive: boolean;
  className?: string;
}

export const FeatureTab = ({ feature, isActive, className }: FeatureTabProps) => {
  const { t } = useTranslation('features');
  
  return (
    <div
      className={cn(
        className,
        'relative rounded-2xl transition-all duration-300',
        isActive ? 'bg-white/10 ring-1 ring-inset ring-white/10' : 'hover:bg-white/5'
      )}
    >
      <div className="relative px-6 pb-6 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            isActive ? 'bg-primary' : 'bg-slate-500'
          )}>
            <feature.icon />
          </div>
          <h3 className="ml-4 text-lg font-medium text-white">
            {t(`secondary.items.${feature.name}.title`)}
          </h3>
        </motion.div>
        <p className="mt-3 text-sm text-slate-300">
          {t(`secondary.items.${feature.name}.description`)}
        </p>
      </div>
    </div>
  );
};