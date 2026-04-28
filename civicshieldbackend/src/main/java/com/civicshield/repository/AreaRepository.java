package com.civicshield.repository;

import com.civicshield.entity.Area;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRepository extends MongoRepository<Area, String> {
    Optional<Area> findByNameAndState(String name, String state);

    List<Area> findByState(Sort sort);

    List<Area> findByState(String state, Sort sort);
}
