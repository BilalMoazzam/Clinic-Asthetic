import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function BookingProgressBar({ currentStep }) {
  const navigate = useNavigate();
  const { settings } = useStore();

  const steps = [
    { id: 1, name: 'Services', path: '/book' },
    { id: 2, name: 'Time', path: '/book/time' },
    { id: 3, name: 'Details', path: '/book/details' },
    { id: 4, name: 'Confirm', path: '/book/confirm' }
  ];

  const handleStepClick = (step) => {
    if (step.id < currentStep) {
      navigate(step.path);
    }
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-0">
      <div className="relative flex items-center justify-between">
        {/* Continuous Track */}
        <div className="absolute top-[10px] left-0 right-0 h-1 bg-outline rounded-full -translate-y-1/2 z-0"></div>
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-[10px] left-0 h-1 rounded-full -translate-y-1/2 z-10"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backgroundColor: activeColor }}
        ></motion.div>
        
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div 
              key={step.id} 
              className="relative z-20 flex flex-col items-center"
            >
              <button 
                onClick={() => handleStepClick(step)}
                disabled={!isCompleted}
                className={`w-5 h-5 rounded-full border-2 bg-surface transition-all duration-300 ${
                  isCompleted ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                }`}
                style={{ 
                  borderColor: (isActive || isCompleted) ? activeColor : 'var(--outline)',
                  backgroundColor: isCompleted ? activeColor : 'var(--surface)'
                }}
              >
                {isCompleted && (
                  <span className="material-symbols-outlined text-white text-[12px] flex items-center justify-center h-full">
                    check
                  </span>
                )}
                {isActive && (
                   <div className="w-2.5 h-2.5 rounded-full mx-auto mt-[1px]" style={{ backgroundColor: activeColor }} />
                )}
              </button>
              
              <div className="absolute top-8 whitespace-nowrap text-center">
                <span 
                  className={`text-xs md:text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}
                  style={{ color: isActive ? activeColor : '' }}
                >
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

