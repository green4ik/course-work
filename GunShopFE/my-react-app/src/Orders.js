import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Minus from './images/minus.png'
function Orders({show,handleShow,orders,orderDetails,product}) {
var row_number = 0;
  return (
    <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Your orders:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Accordion>
        {orders.length > 0 ? (
        orders.map((order) => (
    <Accordion.Item key={order.orderId} eventKey={(++row_number).toString()}>
        <Accordion.Header>Order №{order.orderId}</Accordion.Header>
        <Accordion.Body>
        <div className={`status ${order.orderStatus.toLowerCase()}`}>
                Status: {order.orderStatus}</div>
            <div>Date: {order.orderDate}</div>
            <div>Total price: {order.price}$</div>
            <div>Products:</div>
            {orderDetails.length >0? (
           orderDetails
           .filter((detail) => detail.orderId === order.orderId)
           .map((detail) => (
               <div key={detail.productId}>
                   {product.find((p) => p.productId === detail.productId)?.productName}<span>  </span>
                   {product.find((p) => p.productId === detail.productId)?.price}$ * {detail.quantity} (discount: {detail.discount}%) 
               </div>
            ))):(
                <tr>
                <td colSpan="7">No data available reload page</td>
            </tr> 
            )}
        </Accordion.Body>
    </Accordion.Item>
))
        ):(
            <tr>
                <td colSpan="7">No data available reload page</td>
            </tr>
        )}

    </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleShow}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
  );
}

export default Orders;