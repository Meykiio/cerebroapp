
import React from "react";
import { cn } from "@/lib/utils";

interface WidgetWrapperProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ children, title, icon, className }) => {
  return (
    <div className={cn("widget", className)}>
      <div className="widget-header">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default WidgetWrapper;
