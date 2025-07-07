import 'package:cloud_firestore/cloud_firestore.dart';

class JobCardModel {
  final String id;
  final String customerName;
  final String customerPhone;
  final String vehicleNumber;
  final String vehicleModel;
  final String issueDescription;
  final List<PartUsed> partsUsed;
  final List<String> servicesProvided;
  final double laborCost;
  final double totalAmount;
  final String status;
  final String createdBy;
  final String? approvedBy;
  final String? notes;
  final List<String>? images;
  final DateTime? estimatedCompletion;
  final DateTime? actualCompletion;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  JobCardModel({
    required this.id,
    required this.customerName,
    required this.customerPhone,
    required this.vehicleNumber,
    required this.vehicleModel,
    required this.issueDescription,
    required this.partsUsed,
    required this.servicesProvided,
    required this.laborCost,
    required this.totalAmount,
    required this.status,
    required this.createdBy,
    this.approvedBy,
    this.notes,
    this.images,
    this.estimatedCompletion,
    this.actualCompletion,
    this.createdAt,
    this.updatedAt,
  });

  factory JobCardModel.fromMap(Map<String, dynamic> map, String id) {
    return JobCardModel(
      id: id,
      customerName: map['customerName'] ?? '',
      customerPhone: map['customerPhone'] ?? '',
      vehicleNumber: map['vehicleNumber'] ?? '',
      vehicleModel: map['vehicleModel'] ?? '',
      issueDescription: map['issueDescription'] ?? '',
      partsUsed: (map['partsUsed'] as List<dynamic>?)
          ?.map((part) => PartUsed.fromMap(part as Map<String, dynamic>))
          .toList() ?? [],
      servicesProvided: List<String>.from(map['servicesProvided'] ?? []),
      laborCost: (map['laborCost'] ?? 0.0).toDouble(),
      totalAmount: (map['totalAmount'] ?? 0.0).toDouble(),
      status: map['status'] ?? 'pending',
      createdBy: map['createdBy'] ?? '',
      approvedBy: map['approvedBy'],
      notes: map['notes'],
      images: map['images'] != null ? List<String>.from(map['images']) : null,
      estimatedCompletion: map['estimatedCompletion']?.toDate(),
      actualCompletion: map['actualCompletion']?.toDate(),
      createdAt: map['createdAt']?.toDate(),
      updatedAt: map['updatedAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'customerName': customerName,
      'customerPhone': customerPhone,
      'vehicleNumber': vehicleNumber,
      'vehicleModel': vehicleModel,
      'issueDescription': issueDescription,
      'partsUsed': partsUsed.map((part) => part.toMap()).toList(),
      'servicesProvided': servicesProvided,
      'laborCost': laborCost,
      'totalAmount': totalAmount,
      'status': status,
      'createdBy': createdBy,
      'approvedBy': approvedBy,
      'notes': notes,
      'images': images,
      'estimatedCompletion': estimatedCompletion != null ? Timestamp.fromDate(estimatedCompletion!) : null,
      'actualCompletion': actualCompletion != null ? Timestamp.fromDate(actualCompletion!) : null,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : FieldValue.serverTimestamp(),
    };
  }
}

class PartUsed {
  final String productId;
  final String productName;
  final int quantity;
  final double unitPrice;
  final double totalPrice;

  PartUsed({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory PartUsed.fromMap(Map<String, dynamic> map) {
    return PartUsed(
      productId: map['productId'] ?? '',
      productName: map['productName'] ?? '',
      quantity: map['quantity'] ?? 0,
      unitPrice: (map['unitPrice'] ?? 0.0).toDouble(),
      totalPrice: (map['totalPrice'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'productId': productId,
      'productName': productName,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
    };
  }
}