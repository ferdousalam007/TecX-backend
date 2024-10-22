import catchAsync from '../../utils/catchAsync';
import * as request from '../../utils/helperRequest';
import Category from './category.model';

// export const createCategory = request.createOne(Category);

export const createCategory = catchAsync(async (req, res) => {
  // Check if the category already exists
  const existingCategory = await Category.findOne({
    name: req.body.name.toLowerCase(),
  });
  if (existingCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Category already exists please use other name',
    });
  }

  // Save the new category in lowercase
  const category = await Category.create({ name: req.body.name.toLowerCase() });
  res.status(201).json({
    status: 'success',
    data: category,
  });
});

export const getCategory = request.getOne(Category);
export const getAllCategories = request.getAll(Category);
export const updateCategory = request.updateOne(Category);
export const deleteCategory = request.deleteOne(Category);
