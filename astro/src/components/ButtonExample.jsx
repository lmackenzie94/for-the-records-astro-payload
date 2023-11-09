const BUTTON_VARIANTS = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
};

export const Button = ({ className, variant = BUTTON_VARIANTS.primary }) => {
  return <button className={clsx(className, variant)}>Test Button</button>;
};
