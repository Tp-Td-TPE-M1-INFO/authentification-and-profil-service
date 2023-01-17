const router = require('express').Router();
const storage = require('../middleware/upload.middleware');
const multer = require('multer');
const authController = require('../controllers/auth.controller');
const userController =  require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller')


const upload = multer({storage});

router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

router.get('/get-all-users', userController.getUsers)
router.get("/info/:id", userController.userInfo);
router.put("/update/:id", userController.updateUser)
router.delete("/delete/:id", userController.deleteUser);
router.patch('/add-contact/:id', userController.addContact);
router.get('/list-contacts/:id', userController.listContacts);
router.get('/search', userController.search)
//upload
router.post('/profil/:id', upload.single('file'), uploadController.uploadProfil);

module.exports = router;