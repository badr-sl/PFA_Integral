declare module 'react-gantt-timeline' {
    import React from 'react';
  
    interface TimelineProps {
      data: Array<{
        id: number | string;
        start: Date;
        end: Date;
        name: string;
        [key: string]: any;
      }>;
      links: Array<any>;
      mode?: 'year' | 'month' | 'week' | 'day';
      itemHeight?: number;
      keys?: {
        id: string;
        start: string;
        end: string;
        name: string;
        [key: string]: string;
      };
      [key: string]: any;
    }
  
    export default class Timeline extends React.Component<TimelineProps> {}
  }