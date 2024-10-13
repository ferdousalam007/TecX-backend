"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.getCategory = exports.createCategory = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("../../utils/handlerFactory"));
const category_model_1 = __importDefault(require("./category.model"));
// export const createCategory = factory.createOne(Category);
exports.createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the category already exists
    const existingCategory = yield category_model_1.default.findOne({ name: req.body.name.toLowerCase() });
    if (existingCategory) {
        return res.status(400).json({
            status: 'fail',
            message: 'Category already exists please use other name'
        });
    }
    // Save the new category in lowercase
    const category = yield category_model_1.default.create({ name: req.body.name.toLowerCase() });
    res.status(201).json({
        status: 'success',
        data: category
    });
}));
exports.getCategory = factory.getOne(category_model_1.default);
exports.getAllCategories = factory.getAll(category_model_1.default);
exports.updateCategory = factory.updateOne(category_model_1.default);
exports.deleteCategory = factory.deleteOne(category_model_1.default);
