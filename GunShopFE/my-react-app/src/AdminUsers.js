import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { Pagination } from 'react-bootstrap';
import TablePagination from './TablePagination';
import Minus from './images/minus.png';
import jsPDF from 'jspdf';
function AdminUsers() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const itemsPerPage = 10; // Кількість елементів на сторінці
  const [userLoading, setUserLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const [currentItems, setCurrentItems] = useState([]);
  const [indexOfLastItem, setIndexOfLastItem] = useState(0);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 10; // Начальная координата Y для текста
    userData.forEach((user, index) => {
        doc.text(`User ID: ${user.userId}`, 10, y);
        doc.text(`First Name: ${user.firstName}`, 10, y + 5);
        doc.text(`Last Name: ${user.lastName}`, 10, y + 10);
        doc.text(`Username: ${user.login}`, 10, y + 15);
        doc.text(`Address: ${user.address}`, 10, y + 20);
        doc.text(`Email: ${user.email}`, 10, y + 25);
        doc.text(`Phone number: ${user.phoneNumber}`, 10, y + 30);
        doc.text(`Passport id: ${user.passport}`, 10, y + 35);
        doc.text(`Type: ${user.type}`, 10, y + 40);
        y += 50; // Увеличиваем координату Y для следующего пользователя

        // Проверяем, достигнут ли конец страницы
        if (y >= 287) { // Значение может быть другим в зависимости от версии jsPDF и размера страницы
            doc.addPage(); // Добавляем новую страницу
            y = 10; // Сбрасываем координату Y
        }

        // Добавляем новую страницу, если это не последний пользователь и следующий пользователь не помещается на текущей странице
        if (index !== userData.length - 1 && y + 40 >= 287) {
            doc.addPage(); // Добавляем новую страницу
            y = 10; // Сбрасываем координату Y
        }
    });
    doc.save('users.pdf');
};

  const fetchData = async () => {
    try {
      const response = await fetch(`https://localhost:7183/api/Users/users?page=${currentPage}&itemsPerPage=${itemsPerPage}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setTotalUsers(data.totalUsers);
      setUserData(data.users); // Устанавливаем только данные пользователей в стейт
      setUserLoading(false);

      setIndexOfFirstItem((currentPage - 1) * itemsPerPage);
      setIndexOfLastItem(currentPage * itemsPerPage);
      setCurrentItems(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRemoveUser = async (user) => {
    if (user.type === "admin") {
      alert("Impossible to remove admin!")
      return;
    }
    try {
      const response = await fetch("https://localhost:7183/api/Users/delete/" + user.userId, {
        method: 'DELETE',
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Змінюємо напрямок сортування при подвійному кліку по заголовку
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Сортуємо по новому стовпцю за зростанням напрямку
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (userLoading) {
    return (<div>Loading users...</div>)
  }
  return (
    <Container style={{ marginLeft: '20px' }}>
      <Table striped bordered hover size="sm" variant="dark">
        <thead>
          <tr>
            <th onClick={() => handleSort('userId')}>#id</th>
            <th onClick={() => handleSort('firstName')}>First Name</th>
            <th onClick={() => handleSort('lastName')}>Last Name</th>
            <th onClick={() => handleSort('login')}>Username</th>
            <th onClick={() => handleSort('address')}>Address</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th onClick={() => handleSort('phoneNumber')}>Phone number</th>
            <th onClick={() => handleSort('passport')}>Passport id</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.login}</td>
              <td>{user.address}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.passport}</td>
              <td>{user.type}</td>
              <td><img onClick={() => handleRemoveUser(user)} className="remove-from-cart" src={Minus} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TablePagination
        total={Math.ceil(totalUsers / itemsPerPage)}
        currentPage={currentPage}
        onChangePage={handlePageChange}
      />
       <button onClick={generatePDF}>Download PDF</button>
    </Container>
  );
}

export default AdminUsers;
