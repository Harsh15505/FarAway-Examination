"""
Graph Builder — constructs adjacency graph from seating layout.

Converts center seating layout (rows x cols) into a graph where
adjacent seats are connected by edges.
"""


class GraphBuilder:
    """Build adjacency graph from seating layout."""

    @staticmethod
    def from_grid(rows: int, cols: int) -> dict:
        """
        Create adjacency graph from a grid seating layout.

        Adjacent = horizontally, vertically, and diagonally adjacent seats.

        Returns:
            { nodes: [seat_ids], edges: [(seat_a, seat_b)] }
        """
        # TODO: Implement grid → adjacency graph
        ...

    @staticmethod
    def from_layout(layout: dict) -> dict:
        """
        Create adjacency graph from custom layout with explicit adjacency.

        Args:
            layout: { seats: [{ id, row, col }], adjacency: [(id_a, id_b)] }
        """
        # TODO: Implement
        ...
