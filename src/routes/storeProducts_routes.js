import express from 'express';
import storeProductController from '../controller/storeProducts_controller.js';
import guard from '../guard/guard.js';

const router = express.Router({ mergeParams: true });

// POST /api/stores/:idStore/products
// Tambahkan produk ke toko
router.post('/', async (req, res) => {
  if (
    !guard.setGuard(req, res, {
      required: {
        id_product: 'number', // ← wajib ada, id produk yang ingin ditambahkan
        price: 'number',
        quantity: 'number',
      },
      optional: {},
    })
  )
    return;

  storeProductController.addProduct_To_Store(req, res);
});

router.get('/', storeProductController.getAllProducts_In_Store);

router.get('/:idProduct', storeProductController.getProductDetails_In_Store);

router.put('/:idProduct', async (req, res) => {
  if (
    !guard.setGuard(req, res, {
      required: {},
      optional: {
        price: 'number',
        quantity: 'number',
      },
    })
  )
    return;

  storeProductController.updateProductData_In_Store(req, res);
});

router.delete('/:idProduct', storeProductController.removeProduct_From_Store);

export default router;
