import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  InputAdornment,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  VisibilityOff,
  Image,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/api/apiSlice';
import ImageUpload from '../components/upload/ImageUpload';

// Product form validation schema
const productSchema = yup.object({
  name: yup.string().required('Product name is required').min(2, 'Name too short'),
  nameAr: yup.string().required('Arabic name is required'),
  description: yup.string().required('Description is required').max(1000, 'Description too long'),
  price: yup.number().required('Price is required').min(0, 'Price must be positive'),
  salePrice: yup.number().min(0, 'Sale price must be positive').optional(),
  category: yup.string().required('Category is required'),
  stockQuantity: yup.number().required('Stock quantity is required').min(0, 'Stock must be non-negative'),
});

interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  salePrice?: number;
  category: string;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  isFeatures: boolean;
  tags: string;
  images: string[];
}

const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: productsData, isLoading, error, refetch } = useGetProductsQuery({ 
    page: page + 1, 
    limit: rowsPerPage, 
    search: searchQuery 
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: 0,
      salePrice: undefined,
      category: '',
      stockQuantity: 0,
      inStock: true,
      isActive: true,
      isFeatures: false,
      tags: '',
      images: [],
    },
  });

  const products = productsData?.data?.data || [];
  const pagination = productsData?.data?.pagination;

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Beauty & Health',
    'Sports & Fitness',
    'Home & Garden',
    'Books & Media',
    'Jewelry & Accessories',
    'Toys & Games',
    'Other',
  ];

  const handleAddProduct = () => {
    setEditingProduct(null);
    reset({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: 0,
      salePrice: undefined,
      category: '',
      stockQuantity: 0,
      inStock: true,
      isActive: true,
      isFeatures: false,
      tags: '',
      images: [],
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      nameAr: product.nameAr,
      description: product.description,
      descriptionAr: product.descriptionAr || '',
      price: product.price,
      salePrice: product.salePrice,
      category: product.category,
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      isActive: product.isActive,
      isFeatures: product.isFeatures,
      tags: product.tags.join(', '),
      images: product.images || [],
    });
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        descriptionAr: data.descriptionAr || data.description,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: ['https://via.placeholder.com/400x400/f0f0f0/666?text=Product'],
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: productData }).unwrap();
      } else {
        await createProduct(productData).unwrap();
      }

      setOpenDialog(false);
      refetch();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load products. Please refresh the page.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {pagination?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Products
              </Typography>
              <Typography variant="h4">
                {products.filter(p => p.isActive && p.inStock).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Featured Products
              </Typography>
              <Typography variant="h4">
                {products.filter(p => p.isFeatures).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4">
                {products.filter(p => !p.inStock).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={product.images?.[0]}
                      sx={{ width: 50, height: 50 }}
                    >
                      <Image />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.nameAr}
                      </Typography>
                      {product.isFeatures && (
                        <Chip size="small" icon={<Star />} label="Featured" color="primary" />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Box>
                    {product.salePrice ? (
                      <>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through' }}
                          color="text.secondary"
                        >
                          ${product.price}
                        </Typography>
                        <Typography variant="subtitle2" color="error">
                          ${product.salePrice}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="subtitle2">${product.price}</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${product.stockQuantity} units`}
                    color={product.inStock ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteConfirm(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name (English)"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nameAr"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name (Arabic)"
                      fullWidth
                      error={!!errors.nameAr}
                      helperText={errors.nameAr?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      fullWidth
                      SelectProps={{ native: true }}
                      error={!!errors.category}
                      helperText={errors.category?.message}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tags (comma separated)"
                      fullWidth
                      placeholder="tag1, tag2, tag3"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  images={watch('images') || []}
                  onImagesChange={(images) => setValue('images', images, { shouldDirty: true })}
                  maxImages={5}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="salePrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sale Price (Optional)"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.salePrice}
                      helperText={errors.salePrice?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="stockQuantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Controller
                    name="inStock"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={field.onChange} />}
                        label="In Stock"
                      />
                    )}
                  />
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={field.onChange} />}
                        label="Active"
                      />
                    )}
                  />
                  <Controller
                    name="isFeatures"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={field.onChange} />}
                        label="Featured"
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteConfirm && handleDeleteProduct(deleteConfirm)}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;