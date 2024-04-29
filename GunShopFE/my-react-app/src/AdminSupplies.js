import { useState ,useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { Pagination, Form, Button } from 'react-bootstrap';
import TablePagination from './TablePagination';
import Check from './images/check.png';
import Minus from './images/minus.png';
import Details from './images/details.png';
import Save from './images/save.png';
import Add from './images/add.png';
import { SupplyDetailsModal } from './SupplyDetailsModal';
import jsPDF from 'jspdf';

function AdminSupplies() {
    const [supplyData, setSupplyData] = useState([]);
    const [supplyDetailsData,setSupplyDetailsData] = useState([]);
    const [productData,setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [loading,setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [amount,setAmount] = useState(0);


    const handleProductChange = (productId, value) => {
        setAmount(prevState => ({
          ...prevState,
          [productId]: value
        }));
      };
      const generatePDF = () => {
        const doc = new jsPDF();
        let y = 10; // Начальная координата Y для текста

        supplyData.forEach((supply, index) => {
            doc.text(`Supply ID: ${supply.supplyId}`, 10, y);
            doc.text(`Date: ${supply.supplyDate}`, 10, y + 5);
            doc.text(`Status: ${supply.status}`, 10, y + 10);
            doc.text(`Cost: ${supply.cost}$`, 10, y + 15);
            y += 25; // Увеличиваем координату Y для следующей поставки

            // Проверяем, достигнут ли конец страницы
            if (y >= 287) { // Значение может быть другим в зависимости от версии jsPDF и размера страницы
                doc.addPage(); // Добавляем новую страницу
                y = 10; // Сбрасываем координату Y
            }

            // Добавляем новую страницу, если это не последняя поставка и следующая поставка не помещается на текущей странице
            if (index !== supplyData.length - 1 && y + 15 >= 287) {
                doc.addPage(); // Добавляем новую страницу
                y = 10; // Сбрасываем координату Y
            }
        });

        doc.save('supplies.pdf');
    };
    const handleShow = () => {
        if(show)
            setLoading(true);
        setShow(!show);
    }
    const itemsPerPage = 10; 
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7183/api/Supply/GetSupplies", {
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
        setSupplyData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
    };

    const handleUpdateSupplyStatus = async(supply,status) => {
        try {
            var response = await fetch("https://localhost:7183/api/Supply/UpdateStatus/"+supply.supplyId+"/"+status, {
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
    const handleGetDetails = async(supply) => {
        setLoading(true)
        
        try {
            var response = await fetch("https://localhost:7183/api/Supply/GetSupplyDetails/"+supply.supplyId, {
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
            setSupplyDetailsData(response);
            handleShow();
          setLoading(false);
           
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
    }
    const handleCreateSupply = async() => {
        let data = {

        }
        try {
            const response = await fetch("https://localhost:7183/api/Supply/CreateSupply", {
          method: 'POST',
          body : JSON.stringify(data), 
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to add order detail');
        }
      } catch (error) {
        console.error('Error adding order detail:', error);
      }
    }
    const handleCreateDeatail = async(product) => {
        var price = product.price*0.75;
        let data = {
            productId : product.productId,
            price : price,
            amount: amount[product.productId]
        }
        try {
            const response = await fetch("https://localhost:7183/api/Supply/CreateSupplyDetail", {
          method: 'POST',
          body : JSON.stringify(data), 
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to add order detail');
        }
      } catch (error) {
        console.error('Error adding order detail:', error);
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
      const handlePageChange2 = (pageNumber) => {
        setCurrentPage2(pageNumber);
      };
      
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      let sortedData = [...supplyData];
      
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
      
    //   function testfunc() {
    //     alert(orderDetailsData.map((order)=>(order.orderId)));
    //   }
      
      
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  
    return (
      <Container  style={{ marginLeft: '20px' }}>
        <SupplyDetailsModal handleShow = {handleShow} show = {show} loading = {loading} setLoading = {setLoading} supplyDetails={supplyDetailsData} product = {productData}/>
         {/* <button onClick={testfunc}/> */}
       {/* <OrderDetailsModal handleShow = {handleShow} show = {show} loading = {loading} setLoading = {setLoading} orderDetails={supplyDetailsData} product = {productData}/> */}
        <Table striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th onClick={() => handleSort('supplyId')}>#id</th>
              <th onClick={() => handleSort('supplyDate')}>Date</th>
              <th onClick={() => handleSort('status')}>Status</th>
              <th onClick={() => handleSort('cost')}>Price</th>
              <th ></th>
              <th ></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((supply) => (
              <tr key={supply.supplyId}>
                <td>{supply.supplyId}</td>
                <td>{supply.supplyDate}</td>
                <td>{supply.status}</td>
                <td>{supply.cost}$</td>
                
               
                {supply.status == 'Pending' && (
    <td>
        <img onClick={() => handleUpdateSupplyStatus(supply, 1)} className="remove-from-cart" src={Check} />
        or
        <img onClick={() => handleUpdateSupplyStatus(supply, 2)} className="remove-from-cart" src={Minus} />
    </td>
)}
{supply.status != 'Pending' && (
    <td>
       Done
    </td>
)}
            <td>
            <img onClick={() => handleGetDetails(supply)} className="remove-from-cart" src={Details} />
            </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <TablePagination
          total={Math.ceil(supplyData.length / itemsPerPage)}
          currentPage={currentPage}
          onChangePage={handlePageChange}
        />


<Table striped bordered hover size="sm" variant="dark" className='w-25'>
          <thead>
            <tr>
              <th className='w-75'>Product</th>       
              <th className='w-25'></th>
              <th className='w-25'></th>
            </tr>
          </thead>
          <tbody>
  {productData.map((product) => (
    <tr key={product.productId}>
      <td >{product.productName}</td> 
      <td >{ <input 
          type="number"
          style={{ width: '75%' }}
          value={amount[product.productId] || 0}
          onChange={(e) => handleProductChange(product.productId, e.target.value)}
        />}
        </td> 
      <td>{
        <img onClick={() => handleCreateDeatail(product)} className="remove-from-cart" src={Add} />
        }</td> 
    </tr>
  ))}
</tbody>

        </Table>
        <div className='horizontal-test'><TablePagination
          total={Math.ceil(productData.length / itemsPerPage)}
          currentPage={currentPage2}
          onChangePage={handlePageChange2} 
        />
        <Button className ='h-25'variant="primary" type="button" onClick={handleCreateSupply}>
            Order products
          </Button>
        </div>
        
        <button onClick={generatePDF}>Download PDF</button>
      </Container>
    );
  }
  
  export default AdminSupplies;
