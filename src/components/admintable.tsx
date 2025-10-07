const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';

// Types
interface OrderFlow {
    step: string;
    completed: boolean;
    completedAt?: string;
}

interface Order {
    _id: string;
    userid: string;
    user_address?: {
        _id: string;
    };
    order_date: string;
    order_totalamount: string;
    order_totalcloths: string;
    order_slot: string;
    order_paymenttype: string;
    order_flow: OrderFlow[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface Column {
    header: string;
    key: string;
    render?: (row: Order) => React.ReactNode;
    minWidth?: string; // Optional minimum width for columns
}

interface DataTableProps {
    data: Order[];
    columns: Column[];
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No orders found</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <table className="w-full bg-white 
            shadow-lg rounded-lg overflow-hidden">
                <thead className={`${GRADIENT_CLASS} text-white`}>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: column.minWidth || 'auto' }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-blue-50 transition-colors duration-150"
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                    style={{ minWidth: column.minWidth || 'auto' }}
                                >
                                    {column.render ? column.render(row) : (row as any)[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;