INSERT INTO Users (user_id, username, email, password_hash, role) VALUES
(1, 'alice123', 'alice@example.com', 'hashed123', 'owner'),
(2, 'bobwalker', 'bob@example.com', 'hashed456', 'walker'),
(3, 'carol123', 'carol@example.com', 'hashed789', 'owner'),
(4, 'iris0731', 'iris@example.com', 'hashed1011', 'owner' ),
(5, 'cecilia2004', 'cecilia@example.com', 'hashed1213', 'walker');

INSERT INTO Dogs (dog_id, owner_id, name, size) VALUES
(1, 1, 'Max', 'medium'),
(2, 3, 'Bella', 'small'),
(3, 2, 'Amy', 'large'),
(4, 4, 'Bob', 'small'),
(5, 5, 'wendy', 'large');

INSERT INTO WalkRequests (request_id, dog_id, requested_time, duration_minutes, location, status) VALUES
(1, 1, '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
(2, 2, '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
(3, 3, '2025-06-10 10:00:00', 15, 'Bank St', 'completed'),
(4, 4, '2025-06-10 11:30:00', 60, 'Frome Rd', 'cancelled'),
(5, 5, '2025-06-10 12:00:00', 30, 'Grote St', 'accepted');