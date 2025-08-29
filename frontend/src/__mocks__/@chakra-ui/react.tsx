import React from 'react';

// Mock all Chakra UI components as simple divs with data-testid
export const Box = ({ children, ...props }: any) => (
  <div data-testid="chakra-box" {...props}>{children}</div>
);

export const Text = ({ children, ...props }: any) => (
  <span data-testid="chakra-text" {...props}>{children}</span>
);

export const Button = ({ children, onClick, ...props }: any) => (
  <button data-testid="chakra-button" onClick={onClick} {...props}>
    {children}
  </button>
);

export const IconButton = ({ 'aria-label': ariaLabel, icon, onClick, colorScheme, size, boxSize, ...props }: any) => {
  // Filter out Chakra-specific props to avoid React warnings
  const { borderRadius, _hover, ml, ...cleanProps } = props;
  return (
    <button 
      data-testid="chakra-icon-button" 
      aria-label={ariaLabel}
      onClick={onClick} 
      {...cleanProps}
    >
      {React.cloneElement(icon, { boxSize: undefined })}
    </button>
  );
};

export const Flex = ({ children, ...props }: any) => (
  <div data-testid="chakra-flex" {...props}>{children}</div>
);

export const VStack = ({ children, ...props }: any) => (
  <div data-testid="chakra-vstack" {...props}>{children}</div>
);

export const HStack = ({ children, ...props }: any) => (
  <div data-testid="chakra-hstack" {...props}>{children}</div>
);

export const Stack = ({ children, ...props }: any) => (
  <div data-testid="chakra-stack" {...props}>{children}</div>
);

export const Container = ({ children, ...props }: any) => (
  <div data-testid="chakra-container" {...props}>{children}</div>
);

export const Center = ({ children, ...props }: any) => (
  <div data-testid="chakra-center" {...props}>{children}</div>
);

export const Avatar = ({ src, ...props }: any) => (
  <div data-testid="chakra-avatar" data-src={src} {...props} />
);

export const Image = ({ src, alt, ...props }: any) => (
  <img data-testid="chakra-image" src={src} alt={alt} {...props} />
);

export const Input = ({ name, type, ...props }: any) => (
  <input data-testid="chakra-input" name={name} type={type} {...props} />
);

export const Textarea = ({ name, ...props }: any) => (
  <textarea data-testid="chakra-textarea" name={name} {...props} />
);

export const Select = ({ children, name, ...props }: any) => (
  <select data-testid="chakra-select" name={name} {...props}>
    {children}
  </select>
);

export const FormControl = ({ children, ...props }: any) => (
  <div data-testid="chakra-form-control" {...props}>{children}</div>
);

export const FormLabel = ({ children, ...props }: any) => (
  <label data-testid="chakra-form-label" {...props}>{children}</label>
);

export const Heading = ({ children, ...props }: any) => (
  <h1 data-testid="chakra-heading" {...props}>{children}</h1>
);

export const useToast = () => jest.fn();
export const useMediaQuery = () => [false];
export const useBreakpointValue = () => false;
export const useDisclosure = () => ({
  isOpen: false,
  onOpen: jest.fn(),
  onClose: jest.fn(),
  onToggle: jest.fn(),
});

// Mock other Chakra components used in the app
export const Tab = ({ children, ...props }: any) => (
  <div data-testid="chakra-tab" {...props}>{children}</div>
);

export const Tabs = ({ children, ...props }: any) => (
  <div data-testid="chakra-tabs" {...props}>{children}</div>
);

export const TabList = ({ children, ...props }: any) => (
  <div data-testid="chakra-tablist" {...props}>{children}</div>
);

export const TabPanels = ({ children, ...props }: any) => (
  <div data-testid="chakra-tabpanels" {...props}>{children}</div>
);

export const TabPanel = ({ children, ...props }: any) => (
  <div data-testid="chakra-tabpanel" {...props}>{children}</div>
);

export const Menu = ({ children, ...props }: any) => (
  <div data-testid="chakra-menu" {...props}>{children}</div>
);

export const MenuButton = ({ children, ...props }: any) => (
  <button data-testid="chakra-menu-button" {...props}>{children}</button>
);

export const MenuList = ({ children, ...props }: any) => (
  <div data-testid="chakra-menu-list" {...props}>{children}</div>
);

export const MenuItem = ({ children, onClick, ...props }: any) => (
  <div data-testid="chakra-menu-item" onClick={onClick} {...props}>{children}</div>
);

export const AlertDialog = ({ children, isOpen, ...props }: any) => 
  isOpen ? <div data-testid="chakra-alert-dialog" {...props}>{children}</div> : null;

export const AlertDialogOverlay = ({ children, ...props }: any) => (
  <div data-testid="chakra-alert-dialog-overlay" {...props}>{children}</div>
);

export const AlertDialogContent = ({ children, ...props }: any) => (
  <div data-testid="chakra-alert-dialog-content" {...props}>{children}</div>
);

export const AlertDialogHeader = ({ children, ...props }: any) => (
  <div data-testid="chakra-alert-dialog-header" {...props}>{children}</div>
);

export const AlertDialogBody = ({ children, ...props }: any) => (
  <div data-testid="chakra-alert-dialog-body" {...props}>{children}</div>
);

export const AlertDialogFooter = ({ children, ...props }: any) => (
  <div data-testid="chakra-alert-dialog-footer" {...props}>{children}</div>
);

export const SimpleGrid = ({ children, ...props }: any) => (
  <div data-testid="chakra-simple-grid" {...props}>{children}</div>
);

export const Tag = ({ children, ...props }: any) => (
  <span data-testid="chakra-tag" {...props}>{children}</span>
);

export const SkeletonCircle = (props: any) => (
  <div data-testid="chakra-skeleton-circle" {...props} />
);

export const SkeletonText = (props: any) => (
  <div data-testid="chakra-skeleton-text" {...props} />
);

export const Skeleton = ({ children, ...props }: any) => (
  <div data-testid="chakra-skeleton" {...props}>{children}</div>
);

export const Spinner = (props: any) => (
  <div data-testid="chakra-spinner" {...props} />
);

export const Switch = ({ isChecked, onChange, ...props }: any) => (
  <input 
    type="checkbox" 
    data-testid="chakra-switch" 
    checked={isChecked}
    onChange={onChange}
    {...props} 
  />
);

export const FormErrorMessage = ({ children, ...props }: any) => (
  <div data-testid="chakra-form-error" {...props}>{children}</div>
);

// Default export for ChakraProvider
const ChakraProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="chakra-provider">{children}</div>
);

export default ChakraProvider;