import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:workshop_management/core/models/job_card_model.dart';
import 'package:workshop_management/core/services/auth_service.dart';

final jobCardsProvider = StreamProvider<List<JobCardModel>>((ref) {
  return FirebaseFirestore.instance
      .collection('job_cards')
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => JobCardModel.fromMap(doc.data(), doc.id))
          .toList());
});

class JobCardsPage extends ConsumerStatefulWidget {
  const JobCardsPage({super.key});

  @override
  ConsumerState<JobCardsPage> createState() => _JobCardsPageState();
}

class _JobCardsPageState extends ConsumerState<JobCardsPage> {
  String _selectedStatus = 'all';

  @override
  Widget build(BuildContext context) {
    final jobCardsAsync = ref.watch(jobCardsProvider);
    final userData = ref.watch(userDataProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Job Cards'),
      ),
      body: Column(
        children: [
          // Status Filter
          Container(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _StatusChip(
                    label: 'All',
                    isSelected: _selectedStatus == 'all',
                    onSelected: () => setState(() => _selectedStatus = 'all'),
                  ),
                  _StatusChip(
                    label: 'Pending',
                    isSelected: _selectedStatus == 'pending',
                    onSelected: () => setState(() => _selectedStatus = 'pending'),
                  ),
                  _StatusChip(
                    label: 'In Progress',
                    isSelected: _selectedStatus == 'in_progress',
                    onSelected: () => setState(() => _selectedStatus = 'in_progress'),
                  ),
                  _StatusChip(
                    label: 'Completed',
                    isSelected: _selectedStatus == 'completed',
                    onSelected: () => setState(() => _selectedStatus = 'completed'),
                  ),
                ],
              ),
            ),
          ),
          // Job Cards List
          Expanded(
            child: jobCardsAsync.when(
              data: (jobCards) {
                final filteredJobCards = jobCards.where((jobCard) {
                  return _selectedStatus == 'all' || jobCard.status == _selectedStatus;
                }).toList();

                if (filteredJobCards.isEmpty) {
                  return const Center(
                    child: Text('No job cards found'),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredJobCards.length,
                  itemBuilder: (context, index) {
                    final jobCard = filteredJobCards[index];
                    return JobCardCard(jobCard: jobCard);
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(child: Text('Error: $error')),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create job card page
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class JobCardCard extends StatelessWidget {
  final JobCardModel jobCard;

  const JobCardCard({super.key, required this.jobCard});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    jobCard.customerName,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _StatusBadge(status: jobCard.status),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Phone: ${jobCard.customerPhone}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 4),
            Text(
              'Vehicle: ${jobCard.vehicleNumber} - ${jobCard.vehicleModel}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Issue: ${jobCard.issueDescription}',
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total: \$${jobCard.totalAmount.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  _formatDate(jobCard.createdAt),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Unknown';
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color textColor = Colors.white;

    switch (status) {
      case 'pending':
        backgroundColor = Colors.orange;
        break;
      case 'in_progress':
        backgroundColor = Colors.blue;
        break;
      case 'completed':
        backgroundColor = Colors.green;
        break;
      case 'invoiced':
        backgroundColor = Colors.purple;
        break;
      default:
        backgroundColor = Colors.grey;
    }

    return Chip(
      label: Text(
        status.replaceAll('_', ' ').toUpperCase(),
        style: TextStyle(color: textColor, fontSize: 12),
      ),
      backgroundColor: backgroundColor,
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onSelected;

  const _StatusChip({
    required this.label,
    required this.isSelected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) => onSelected(),
      ),
    );
  }
}