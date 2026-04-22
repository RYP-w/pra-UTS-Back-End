import express from 'express';
import orderProductController from '../controller/orderProducts_controller.js';
import guard from '../guard/guard.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  if (
    !guard.setGuard(req, res, {
      required: {
        id_store_product: 'number',
        quantity: 'number',
      },
      optional: {},
    })
  )
    return;

  orderProductController.addProduct_to_order(req, res);
});

router.get('/', orderProductController.getAllProducts_in_Order);

router.put('/:idProduct', async (req, res) => {
  if (
    !guard.setGuard(req, res, {
      required: {},
      optional: {
        quantity: 'number',
      },
    })
  )
    return;

  orderProductController.updateProductData_in_order(req, res);
});

router.delete('/:idProduct', orderProductController.removeProduct_from_order);

export default router;
