import * as React from 'react';

import { cn } from '@/lib/utils';
import { GreenButton } from './green-button';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className='relative w-full overflow-auto'>
    <table
      ref={ref}
      className={cn('w-full border-collapse border-spacing-2 p-5 sm:p-5 caption-bottom text-[13px] text-white border border-[#48423E] rounded-b-[6px] bg-[#0F090B]', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0 ', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-none transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      'p-[6px] px-[10px] text-center',
      '[&:first-child]:pt-4 [&:last-child]:pb-4',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('px-2 text-gradient font-normal   text-center align-middle text-[13px]  [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('text-[13px] text-white align-middle text-center p-2', className)} {...props} />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

interface DynamicTableProps<T> {
  data: T[];
  columns: (keyof T)[];
  hasHeader?: boolean;
}

export function DynamicTable<T>({ data, columns, hasHeader = false }: DynamicTableProps<T>) {
  return (
    <Table>
      {hasHeader && (
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            {columns.map((column, index) => (
              <TableHead key={index}>{String(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.length === 0 ? (
          <TableRow className='hover:bg-transparent'>
            <TableCell colSpan={columns.length} className='py-4 text-center text-white/60'>
              No data
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className='py-3'>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {String(column).toLowerCase() === 'status' ? (
                    <GreenButton className='rounded-full- w-[72px] h-[16px] text-[12px] font-bold'>
                      <span className='text-gradient-green'>ACTIVATED</span>
                    </GreenButton>
                  ) : (
                    String(row[column])
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default DynamicTable;
