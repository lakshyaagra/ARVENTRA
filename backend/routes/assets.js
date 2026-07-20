const express = require('express');
const router = express.Router();
const validateAsset = require("../middleware/validateAsset");
const validateUpdateAsset = require('../middleware/validateUpdateAsset')
const { createAsset,getAssets,getAssetById,updateAssetById, deleteAssetById } = require("../controllers/assetControllers");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware,validateUpdateAsset, createAsset);
router.get('/',authMiddleware,getAssets); 
router.get('/:id',authMiddleware, getAssetById);
router.put('/:id', authMiddleware,validateUpdateAsset, updateAssetById);
router.delete('/:id',authMiddleware, deleteAssetById);

module.exports = router;
