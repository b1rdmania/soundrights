import React from 'react';
import { AlertCircle, Wifi, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorHandlerProps {
  error: Error | string;
  retry?: () => void;
  context?: 'api' | 'wallet' | 'upload' | 'general';
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ 
  error, 
  retry, 
  context = 'general' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const getErrorInfo = () => {
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        icon: Shield,
        title: 'Authentication Required',
        message: 'Please connect your wallet to access this feature',
        action: 'Connect Wallet',
        actionPath: '/wallet/connect'
      };
    }
    
    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return {
        icon: Wifi,
        title: 'Connection Issue',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        action: 'Retry',
        actionFn: retry
      };
    }
    
    if (context === 'upload') {
      return {
        icon: AlertCircle,
        title: 'Upload Failed',
        message: 'There was an issue processing your file. Please try again with a different file.',
        action: 'Try Again',
        actionFn: retry
      };
    }
    
    return {
      icon: AlertCircle,
      title: 'Something went wrong',
      message: errorMessage || 'An unexpected error occurred',
      action: 'Retry',
      actionFn: retry
    };
  };

  const { icon: Icon, title, message, action, actionFn, actionPath } = getErrorInfo();

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        <div className="flex gap-3">
          {actionFn && (
            <Button onClick={actionFn} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {action}
            </Button>
          )}
          
          {actionPath && (
            <Button 
              onClick={() => window.location.href = actionPath}
              className="flex items-center gap-2"
            >
              {action}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mb-3"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  onAction 
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    
    {(actionLabel && (actionHref || onAction)) && (
      <Button
        onClick={onAction}
        className="bg-purple-600 hover:bg-purple-700"
        {...(actionHref && { as: 'a', href: actionHref })}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);