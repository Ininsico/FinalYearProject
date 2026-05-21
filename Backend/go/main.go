package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

type SpatialAnchor struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	X          float64 `json:"x"`
	Y          float64 `json:"y"`
	Z          float64 `json:"z"`
	Confidence float64 `json:"confidence"`
}

// Thread-safe in-memory database of spatial anchors
type SpatialDB struct {
	mu      sync.RWMutex
	anchors map[string]SpatialAnchor
}

func NewSpatialDB() *SpatialDB {
	db := &SpatialDB{
		anchors: make(map[string]SpatialAnchor),
	}
	// Seed with global reference anchors
	db.anchors["1"] = SpatialAnchor{ID: "1", Name: "Global Origin Reference", X: 0.0, Y: 0.0, Z: 0.0, Confidence: 100.0}
	db.anchors["2"] = SpatialAnchor{ID: "2", Name: "Calibrated Room Bound A", X: 4.5, Y: 0.0, Z: -2.3, Confidence: 98.4}
	return db
}

func (db *SpatialDB) GetAll() []SpatialAnchor {
	db.mu.RLock()
	defer db.mu.RUnlock()
	list := make([]SpatialAnchor, 0, len(db.anchors))
	for _, anchor := range db.anchors {
		list = append(list, anchor)
	}
	return list
}

func (db *SpatialDB) Save(a SpatialAnchor) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.anchors[a.ID] = a
}

func main() {
	db := NewSpatialDB()

	// Handler: Fetch current anchors
	http.HandleFunc("/api/go/anchors", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		anchors := db.GetAll()
		json.NewEncoder(w).Encode(anchors)
	})

	// Handler: High-concurrency anchor registering sync channel
	http.HandleFunc("/api/go/sync", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var newAnchor SpatialAnchor
		err := json.NewDecoder(r.Body).Decode(&newAnchor)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		newAnchor.ID = fmt.Sprintf("go-%d", time.Now().UnixNano())
		if newAnchor.Confidence == 0 {
			newAnchor.Confidence = 96.5
		}

		db.Save(newAnchor)

		log.Printf("[GO] Synchronized spatial anchor successfully: %s [%.2f, %.2f, %.2f]", newAnchor.Name, newAnchor.X, newAnchor.Y, newAnchor.Z)
		
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newAnchor)
	})

	port := ":4000"
	log.Printf("[GO] Aether high-concurrency spatial synchronization server active on %s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
