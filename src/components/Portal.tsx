'use client';

import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  rootId?: string;
}

export default function Portal({ children, rootId = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  
  // Create portal container if it doesn't exist
  useEffect(() => {
    setMounted(true);
    
    let portalRoot = document.getElementById(rootId);
    
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = rootId;
      document.body.appendChild(portalRoot);
    }
    
    return () => {
      // Clean up portal root if it's empty when this portal unmounts
      const root = document.getElementById(rootId);
      if (root && root.childNodes.length === 0) {
        document.body.removeChild(root);
      }
    };
  }, [rootId]);
  
  // Only render the portal on the client side
  if (!mounted) return null;
  
  // Create portal to the root
  const portalRoot = document.getElementById(rootId);
  if (!portalRoot) return null;
  
  return createPortal(children, portalRoot);
} 