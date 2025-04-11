import React, { createContext, useState, useContext, ReactNode } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';
type PanelType = 'nodes' | 'properties' | 'settings';

interface PanPosition {
  x: number;
  y: number;
}

interface Notification {
  message: string;
  type: NotificationType;
  duration: number;
}

interface UIContextType {
  // Sidebar
  isSidebarOpen: boolean;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  toggleSidebar: () => void;
  
  // Canvas
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  panPosition: PanPosition;
  setPanPosition: (position: PanPosition) => void;
  resetView: () => void;
  
  // Modals
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (isOpen: boolean) => void;
  isSaveModalOpen: boolean;
  setIsSaveModalOpen: (isOpen: boolean) => void;
  isLoadModalOpen: boolean;
  setIsLoadModalOpen: (isOpen: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  
  // Tutorial
  isTutorialActive: boolean;
  tutorialStep: number;
  startTutorial: () => void;
  endTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  
  // Notification
  notification: Notification | null;
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  clearNotification: () => void;
}

interface UIProviderProps {
  children: ReactNode;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export function UIProvider({ children }: UIProviderProps): JSX.Element {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePanel, setActivePanel] = useState<PanelType>('nodes');
  
  // Canvas state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<PanPosition>({ x: 0, y: 0 });
  
  // Modal states
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  // Tutorial state
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  
  // Notification state
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // Toggle sidebar
  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Show notification
  const showNotification = (
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 3000
  ): void => {
    setNotification({ message, type, duration });
    
    // Auto-dismiss notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };
  
  // Clear notification
  const clearNotification = (): void => {
    setNotification(null);
  };
  
  // Start tutorial
  const startTutorial = (): void => {
    setIsTutorialActive(true);
    setTutorialStep(0);
  };
  
  // End tutorial
  const endTutorial = (): void => {
    setIsTutorialActive(false);
    setTutorialStep(0);
  };
  
  // Next tutorial step
  const nextTutorialStep = (): void => {
    setTutorialStep(tutorialStep + 1);
  };
  
  // Previous tutorial step
  const prevTutorialStep = (): void => {
    setTutorialStep(Math.max(0, tutorialStep - 1));
  };
  
  // Reset zoom and pan
  const resetView = (): void => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  const value: UIContextType = {
    // Sidebar
    isSidebarOpen,
    activePanel,
    setActivePanel,
    toggleSidebar,
    
    // Canvas
    zoomLevel,
    setZoomLevel,
    panPosition,
    setPanPosition,
    resetView,
    
    // Modals
    isHelpModalOpen,
    setIsHelpModalOpen,
    isSaveModalOpen,
    setIsSaveModalOpen,
    isLoadModalOpen,
    setIsLoadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    
    // Tutorial
    isTutorialActive,
    tutorialStep,
    startTutorial,
    endTutorial,
    nextTutorialStep,
    prevTutorialStep,
    
    // Notification
    notification,
    showNotification,
    clearNotification,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
