import { supabase } from "@/integrations/supabase/client";

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id?: string;
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  metadata?: Record<string, any>;
  user_id?: string;
}

class Logger {
  private static instance: Logger;
  private serviceName: string;
  private userId?: string;

  private constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public static getInstance(serviceName: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(serviceName);
    }
    return Logger.instance;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  private async logToDatabase(entry: LogEntry) {
    try {
      const { error } = await supabase
        .from('logs')
        .insert({
          ...entry,
          user_id: this.userId,
        });

      if (error) {
        console.error('Failed to log to database:', error);
      }
    } catch (error) {
      console.error('Error logging to database:', error);
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const logMessage = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.service}]: ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(logMessage, entry.metadata);
        break;
      case 'warn':
        console.warn(logMessage, entry.metadata);
        break;
      case 'debug':
        console.debug(logMessage, entry.metadata);
        break;
      default:
        console.log(logMessage, entry.metadata);
    }
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      metadata,
      user_id: this.userId,
    };
  }

  public async info(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, metadata);
    this.logToConsole(entry);
    await this.logToDatabase(entry);
  }

  public async warn(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, metadata);
    this.logToConsole(entry);
    await this.logToDatabase(entry);
  }

  public async error(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, metadata);
    this.logToConsole(entry);
    await this.logToDatabase(entry);
  }

  public async debug(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('debug', message, metadata);
    this.logToConsole(entry);
    await this.logToDatabase(entry);
  }
}

export default Logger; 