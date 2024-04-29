import { useState ,useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { Pagination, Form, Button } from 'react-bootstrap';
import TablePagination from './TablePagination';
import Minus from './images/minus.png';
import Edit from './images/edit.png';
import Save from './images/save.png';
import jsPDF from 'jspdf';

function AdminProducts() {
    const [productsData, setProductsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [newProduct, setNewProduct] = useState({
      productName: '',
      manufacturer: '',
      price: '',
      discount: '',
      image: '', 
    });
    const itemsPerPage = 10; // Кількість елементів на сторінці
    const [editMode, setEditMode] = useState({});

    const toggleEditMode = (productId) => {
      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        [productId]: !prevEditMode[productId]
      }));
    };
    const generatePDF = () => {
      const doc = new jsPDF();
      let y = 10; // Начальная координата Y для текста

      productsData.forEach((product, index) => {
          doc.text(`Product ID: ${product.productId}`, 10, y);
          doc.text(`Product Name: ${product.productName}`, 10, y + 5);
          doc.text(`Manufacturer: ${product.manufacturer}`, 10, y + 10);
          doc.text(`Price: ${product.price}$`, 10, y + 15);
          doc.text(`Discount: ${product.discount}%`, 10, y + 20);
          doc.text(`Quantity in Stock: ${product.quantityInStock}`, 10, y + 25);
          y += 35; // Увеличиваем координату Y для следующего продукта

          // Проверяем, достигнут ли конец страницы
          if (y >= 287) { // Значение может быть другим в зависимости от версии jsPDF и размера страницы
              doc.addPage(); // Добавляем новую страницу
              y = 10; // Сбрасываем координату Y
          }

          // Добавляем новую страницу, если это не последний продукт и следующий продукт не помещается на текущей странице
          if (index !== productsData.length - 1 && y + 25 >= 287) {
              doc.addPage(); // Добавляем новую страницу
              y = 10; // Сбрасываем координату Y
          }
      });

      doc.save('products.pdf');
  };
    useEffect(() => {
      fetchData();
    }, []);

    const handleProductChange = (productId, field, value) => {
      const updatedProducts = [...productsData];
      const index = updatedProducts.findIndex(product => product.productId === productId);
      if (index !== -1) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]: value
        };
        setProductsData(updatedProducts);
      }
    };

    const saveProductChanges = async (productId) => {
      try {
        var product = productsData.find(p => p.productId === productId);
        let data = {
          productName: product.productName,
          manufacturer : product.manufacturer,
          price : product.price,
          quantityInStock: product.quantityInStock,
          discount: product.discount
        };

        const response = await fetch("https://localhost:7183/api/Product/UpdateProduct/"+productId, {
          method: 'PUT',
          body : JSON.stringify(data),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleRemoveProduct = async(product) => {
      try {
        const response = await fetch("https://localhost:7183/api/Product/DeleteProduct/"+product.productId, {
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

    const handleAddProduct = async() => {
      try {
        const info = {
          productName: newProduct.productName,
          manufacturer: newProduct.manufacturer,
          price: newProduct.price,
          discount: newProduct.discount,
          image: '/images/no-image.jpg'
      };
      //alert(JSON.stringify(info));
        //alert(newProduct.productName);
        const response = await fetch("https://localhost:7183/api/Product/Add", {
          method: 'POST',
          body : JSON.stringify(info), 
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        // Clear the form fields after successful addition
        setNewProduct({
          productName: '',
          manufacturer: '',
          price: '',
          discount: '',
        });
        fetchData();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };
   
    
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7183/api/Product/Get", {
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
        setProductsData(data);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let sortedData = [...productsData];

    if (sortColumn) {
      sortedData = sortedData.sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        // Перевіряємо, чи не є значення null перед викликом методу localeCompare
        if (valueA !== null && valueB !== null) {
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            // Якщо обидва значення - числа, порівнюємо їх як числа
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          } else {
            // Інакше, використовуємо метод localeCompare для рядків
            return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          }
        }
        return 0;
      });
    }

    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <Container style={{ marginLeft: '20px' }}>
        <Table striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th onClick={() => handleSort('productId')}>#id</th>
              <th onClick={() => handleSort('productName')}>Product name</th>
              <th onClick={() => handleSort('manufacturer')}>Manufacturer</th>
              <th onClick={() => handleSort('price')}>Price</th>
              <th onClick={() => handleSort('discount')}>Discount</th>
              <th onClick={() => handleSort('quantityInStock')}>Quantity</th>
              <th >Edit</th>
              <th >Del</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  {editMode[product.productId] ? (
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) => handleProductChange(product.productId, 'productName', e.target.value)}
                    />
                  ) : (
                    product.productName
                  )}
                </td>
                <td>
                  {editMode[product.productId] ? (
                    <input
                      type="text"
                      value={product.manufacturer}
                      onChange={(e) => handleProductChange(product.productId, 'manufacturer', e.target.value)}
                    />
                  ) : (
                    product.manufacturer
                  )}
                </td>
                <td>
                  {editMode[product.productId] ? (
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleProductChange(product.productId, 'price', e.target.value)}
                    />
                  ) : (
                    `${product.price}$`
                  )}
                </td>
                <td>
                  {editMode[product.productId] ? (
                    <input
                      type="number"
                      value={product.discount}
                      onChange={(e) => handleProductChange(product.productId, 'discount', e.target.value)}
                    />
                  ) : (
                    `${product.discount}%`
                  )}
                </td>
                <td>{product.quantityInStock}</td>
                <td>
                  <img onClick={() => {toggleEditMode(product.productId);
                    if (editMode[product.productId]) {
                      saveProductChanges(product.productId);
                    }
                  }} className = 'remove-from-cart'src = {editMode[product.productId] ? Save : Edit}/>
                </td>
                <td><img onClick={() => handleRemoveProduct(product)} className="remove-from-cart" src = {Minus}/></td>
                
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination
          total={Math.ceil(productsData.length / itemsPerPage)}
          currentPage={currentPage}
          onChangePage={handlePageChange}
        />
        <Form>
          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control type="text" className ='w-25'placeholder="Enter product name" value={newProduct.productName} onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}/>
          </Form.Group>

          <Form.Group controlId="formManufacturer">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control type="text" className ='w-25'placeholder="Enter manufacturer" value={newProduct.manufacturer} onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}/>
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" className ='w-25'placeholder="Enter price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}/>
          </Form.Group>

          <Form.Group controlId="formDiscount">
            <Form.Label>Discount</Form.Label>
            <Form.Control type="number" className ='w-25'placeholder="Enter discount" value={newProduct.discount} onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}/>
          </Form.Group>
          <Button variant="primary" type="button" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Form>
        <button onClick={generatePDF}>Download PDF</button>
      </Container>
    );
}

export default AdminProducts;
