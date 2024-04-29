import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function OrderDetailsModal({handleShow,show,loading,product,orderDetails}) {
    const [Loading,setLoading] = useState(true);
    useEffect(() => {
       setLoading(loading)
    }, [loading]);
    if(Loading) {
        return <div></div>; 
    }else 
    
    return(
<Modal show={show} onHide={handleShow}>
<Modal.Header closeButton>
  <Modal.Title>Order details:</Modal.Title>
</Modal.Header>
<Modal.Body>

{orderDetails.length >0? (
           orderDetails
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
</Modal.Body>
<Modal.Footer>
  <Button variant="primary" onClick={handleShow}>
    Close
  </Button>
</Modal.Footer>
</Modal>
    )
}
