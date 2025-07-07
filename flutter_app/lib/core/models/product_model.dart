import 'package:cloud_firestore/cloud_firestore.dart';

class ProductModel {
  final String id;
  final String name;
  final String type;
  final String category;
  final int quantity;
  final double unitPrice;
  final int minStock;
  final String? description;
  final String? brand;
  final String lastUpdatedBy;
  final DateTime? lastUpdated;
  final DateTime? createdAt;

  ProductModel({
    required this.id,
    required this.name,
    required this.type,
    required this.category,
    required this.quantity,
    required this.unitPrice,
    required this.minStock,
    this.description,
    this.brand,
    required this.lastUpdatedBy,
    this.lastUpdated,
    this.createdAt,
  });

  factory ProductModel.fromMap(Map<String, dynamic> map, String id) {
    return ProductModel(
      id: id,
      name: map['name'] ?? '',
      type: map['type'] ?? 'part',
      category: map['category'] ?? '',
      quantity: map['quantity'] ?? 0,
      unitPrice: (map['unitPrice'] ?? 0.0).toDouble(),
      minStock: map['minStock'] ?? 5,
      description: map['description'],
      brand: map['brand'],
      lastUpdatedBy: map['lastUpdatedBy'] ?? '',
      lastUpdated: map['lastUpdated']?.toDate(),
      createdAt: map['createdAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'type': type,
      'category': category,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'minStock': minStock,
      'description': description,
      'brand': brand,
      'lastUpdatedBy': lastUpdatedBy,
      'lastUpdated': lastUpdated != null ? Timestamp.fromDate(lastUpdated!) : null,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
    };
  }

  bool get isLowStock => quantity <= minStock;
  bool get isOutOfStock => quantity == 0;
}