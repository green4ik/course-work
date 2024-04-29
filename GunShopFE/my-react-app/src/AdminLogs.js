import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import TablePagination from './TablePagination';
import Minus from './images/minus.png';

function AdminLogs() {
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const itemsPerPage = 10; // Количество элементов на странице
    const [logLoading, setLogLoading] = useState(true);

    const [currentItems, setCurrentItems] = useState([]);
    const [indexOfLastItem, setIndexOfLastItem] = useState(0);
    const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://localhost:7183/api/Log/GetLogs?pageNumber=${currentPage}&itemsPerPage=${itemsPerPage}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            setTotalLogs(responseData.totalLogs);
            setLogData(responseData.logs); // Устанавливаем только данные логов в стейт
            setLogLoading(false);

            setIndexOfFirstItem((currentPage - 1) * itemsPerPage);
            setIndexOfLastItem(currentPage * itemsPerPage);
            setCurrentItems(responseData.logs);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            // Изменяем направление сортировки при двойном клике по заголовку
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Сортируем по новому столбцу по возрастанию направления
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (logLoading) {
        return (<div>Loading logs...</div>)
    }

    return (
        <Container style={{ marginLeft: '20px' }}>
            <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('recordId')}>#id</th>
                        <th onClick={() => handleSort('changeDate')}>Date</th>
                        <th onClick={() => handleSort('changeDescription')}>Description</th>
                        <th onClick={() => handleSort('userId')}>User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((log) => (
                        <tr key={log.recordId}>
                            <td>{log.recordId}</td>
                            <td>{log.changeDate}</td>
                            <td>{log.changeDescription}</td>
                            <td>{log.userId}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <TablePagination
                total={Math.ceil(totalLogs / itemsPerPage)}
                currentPage={currentPage}
                onChangePage={handlePageChange}
            />
        </Container>
    );
}

export default AdminLogs;
