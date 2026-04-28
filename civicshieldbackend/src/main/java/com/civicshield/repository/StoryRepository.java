package com.civicshield.repository;

import com.civicshield.entity.Story;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StoryRepository extends MongoRepository<Story, String> {
    List<Story> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
}
