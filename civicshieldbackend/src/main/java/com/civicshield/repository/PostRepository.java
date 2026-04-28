package com.civicshield.repository;

import com.civicshield.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    Page<Post> findByStateOrderByCreatedAtDesc(String state, Pageable pageable);

    Page<Post> findByStateAndCategoryOrderByCreatedAtDesc(String state, String category, Pageable pageable);

    @Query(value = "{ 'latitude': { '$gte': ?0, '$lte': ?1 }, 'longitude': { '$gte': ?2, '$lte': ?3 } }", sort = "{ 'createdAt': -1 }")
    List<Post> findByLocationBoundingBox(double latMin, double latMax, double lonMin, double lonMax);

    long countByStateAndSeverity(String state, String severity);
}
