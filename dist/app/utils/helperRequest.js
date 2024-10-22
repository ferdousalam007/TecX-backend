"use strict";
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
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const catchAsync_1 = __importDefault(require("./catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const apiFeatures_1 = __importDefault(require("./apiFeatures"));
const http_status_1 = __importDefault(require("http-status"));
const deleteOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError_1.default(404, 'No document found with that ID'));
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `${Model.modelName} Deleted successfully`,
        data: doc,
    });
}));
exports.deleteOne = deleteOne;
const updateOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, `${Model.modelName} not found`));
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `${Model.modelName} updated successfully`,
        data: doc,
    });
}));
exports.updateOne = updateOne;
const createOne = (Model) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: `${Model.modelName} created successfully`,
        data: doc,
    });
}));
exports.createOne = createOne;
const getOne = (Model, popOptions) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = Model.findById(req.params.id).populate(popOptions || '');
        const doc = yield query.exec();
        if (!doc) {
            return next(new AppError_1.default(http_status_1.default.NOT_FOUND, `${Model.modelName} not found`));
        }
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: `A ${Model.modelName} retrieved successfully`,
            data: doc,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.getOne = getOne;
const getAll = (Model, popOptions) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const features = new apiFeatures_1.default(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        if (popOptions)
            features.query = features.query.populate(popOptions);
        const doc = yield features.query;
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: `${Model.modelName} retrieved successfully`,
            data: doc,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.getAll = getAll;
