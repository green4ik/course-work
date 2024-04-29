import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Minus from './images/minus.png'
function Cart({show,handleShow,cartData,product,removeFromCart,submitOrder}) {
    const handleRemoveFromCart = (cartData) => {
        removeFromCart(cartData);
      };

function submit() {
    handleShow();
    submitOrder();
}
    var row_number = 0;
  return (
    <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Your cart:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Product name</th>
          <th>Unit price</th>
          <th>Discount</th>
          <th>Amount</th>
          <th>Total price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
       
      {cartData.length > 0 ? (
    cartData.map((cart) => (
        <tr key={cart.productId}>
            <td>{++row_number}</td>
            <td>{product.find((p) => p.productId === cart.productId)?.productName}</td>
            <td>{cart.unitPrice}</td>
            <td>{cart.discount}</td>
            <td>{cart.amount}</td>
            <td>{cart.totalPrice}</td>
            <td><img onClick={() => handleRemoveFromCart(cart)} className="remove-from-cart" src = {Minus}/></td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan="7">No data available</td>
    </tr>
)}
       
      </tbody>
    </Table>
       

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
          {cartData.length > 0 ? (<Button variant="primary" onClick={submit} >
            Complete order
          </Button>) : (
    <Button variant="primary" onClick={submit} disabled>
    Complete order
  </Button>
)}
          
        </Modal.Footer>
      </Modal>
  );
}

export default Cart;