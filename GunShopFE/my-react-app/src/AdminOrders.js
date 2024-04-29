import { useState ,useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { Pagination } from 'react-bootstrap';
import TablePagination from './TablePagination';
import Check from './images/check.png';
import Minus from './images/minus.png';
import Details from './images/details.png';
import Save from './images/save.png';
import { OrderDetailsModal } from './OrderDetailsModal';
import jsPDF from 'jspdf';


function AdminOrders() {
    const [orderData, setOrderData] = useState([]);
    const [orderDetailsData,setOrderDetailsData] = useState([]);
    const [productData,setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [loading,setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const handleShow = () => {
        if(show)
            setLoading(true);
        setShow(!show);
    }
    const itemsPerPage = 10; 
    const generatePDF = () => {
      const doc = new jsPDF();
      let y = 10; // Начальная координата Y для текста
      orderData.forEach((order, index) => {
          doc.text(`Order ID: ${order.orderId}`, 10, y);
          doc.text(`User ID: ${order.userId}`, 10, y + 5);
          doc.text(`Date: ${order.orderDate}`, 10, y + 10);
          doc.text(`Price: ${order.price}$`, 10, y + 15);
          doc.text(`Status: ${order.orderStatus}`, 10, y + 20);
          y += 30; // Увеличиваем координату Y для следующего заказа
  
          // Проверяем, достигнут ли конец страницы
          if (y >= 287) { // Значение может быть другим в зависимости от версии jsPDF и размера страницы
              doc.addPage(); // Добавляем новую страницу
              y = 10; // Сбрасываем координату Y
          }
  
          // Добавляем новую страницу, если это не последний заказ и следующий заказ не помещается на текущей странице
          if (index !== orderData.length - 1 && y + 20 >= 287) {
              doc.addPage(); // Добавляем новую страницу
              y = 10; // Сбрасываем координату Y
          }
      });
      doc.save('orders.pdf');
  };
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7183/api/Order/GetOrders", {
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
        setOrderData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const handleUpdateOrderStatus = async(order,status) => {
        try {
            var response = await fetch("https://localhost:7183/api/Order/UpdateStatus/"+order.orderId+"/"+status, {
              method: 'PUT',
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
    const handleGetDetails = async(order) => {
        setLoading(true)
        try {
            var response = await fetch("https://localhost:7183/api/Product/Get", {
              method: 'GET',
              headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
              }
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            response = await response.json();
            //alert(response.map((order)=>(order.productId)));
            setProductData(response);
            
           
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        try {
            var response = await fetch("https://localhost:7183/api/Order/GetOrderDetails/"+order.orderId, {
              method: 'GET',
              headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
              }
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            
            response = await response.json();
            //alert(response.map((order)=>(order.orderId)));
            setOrderDetailsData(response);
            handleShow();
          setLoading(false);
           
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
    }
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
      
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      let sortedData = [...orderData];
      
      if (sortColumn) {
        sortedData = sortedData.sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
      
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            // Якщо обидва значення - числа, порівнюємо їх як числа
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          } else {
            // Інакше, використовуємо метод localeCompare для рядків
            return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          }
        });
      }
      
      function testfunc() {
        alert(orderDetailsData.map((order)=>(order.orderId)));
      }
      
      
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  
    return (
      <Container  style={{ marginLeft: '20px' }}>
         {/* <button onClick={testfunc}/> */}
       <OrderDetailsModal handleShow = {handleShow} show = {show} loading = {loading} setLoading = {setLoading} orderDetails={orderDetailsData} product = {productData}/>
        <Table striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th onClick={() => handleSort('orderId')}>#id</th>
              <th onClick={() => handleSort('userId')}>User id</th>
              <th onClick={() => handleSort('orderDate')}>Date</th>
              <th onClick={() => handleSort('price')}>Price</th>
              <th onClick={() => handleSort('orderStatus')}>Status</th>
              <th ></th>
              <th ></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.userId}</td>
                <td>{order.orderDate}</td>
                <td>{order.price}$</td>
                <td>{order.orderStatus}</td>
               
                {order.orderStatus == 'Pending' && (
    <td>
        <img onClick={() => handleUpdateOrderStatus(order, 1)} className="remove-from-cart" src={Check} />
        or
        <img onClick={() => handleUpdateOrderStatus(order, 2)} className="remove-from-cart" src={Minus} />
    </td>
)}
{order.orderStatus != 'Pending' && (
    <td>
       Done
    </td>
)}
            <td>
            <img onClick={() => handleGetDetails(order)} className="remove-from-cart" src={Details} />
            </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination
          total={Math.ceil(orderData.length / itemsPerPage)}
          currentPage={currentPage}
          onChangePage={handlePageChange}
        />
        <button onClick={generatePDF}>Download PDF</button>
      </Container>
    );
  }
  
  export default AdminOrders;
