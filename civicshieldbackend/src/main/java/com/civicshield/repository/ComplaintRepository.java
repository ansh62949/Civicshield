package com.civicshield.repository;

import com.civicshield.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);

    Page<Complaint> findByStateAndStatusOrderByCreatedAtDesc(String state, String status, Pageable pageable);

    Page<Complaint> findByStateAndPriorityOrderByCreatedAtDesc(String state, String priority, Pageable pageable);

    List<Complaint> findByState(String state);

    List<Complaint> findByStateOrderByCreatedAtDesc(String state);

    long countByStateAndStatus(String state, String status);

}

