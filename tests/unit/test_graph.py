"""Unit tests — shared/graph (graph builder, coloring, variant generator)."""


class TestGraphBuilder:
    """Adjacency graph construction tests."""

    def test_grid_layout_adjacency(self):
        """Grid layout should create correct adjacency edges."""
        # TODO: Implement
        ...

    def test_corner_seats_have_fewer_neighbors(self):
        """Corner seats should have fewer adjacent seats than center seats."""
        # TODO: Implement
        ...


class TestGraphColoring:
    """Graph coloring assignment tests."""

    def test_no_adjacent_seats_share_color(self):
        """No two adjacent seats should have the same variant."""
        # TODO: Implement
        ...

    def test_minimum_colors_used(self):
        """Should use minimal number of colors (variants)."""
        # TODO: Implement
        ...


class TestVariantGenerator:
    """Variant generation tests."""

    def test_correct_number_of_variants(self):
        """Should generate exactly N variants."""
        # TODO: Implement
        ...

    def test_all_questions_present_in_each_variant(self):
        """Each variant should contain all questions."""
        # TODO: Implement
        ...

    def test_question_order_differs_between_variants(self):
        """Different variants should have different question orders."""
        # TODO: Implement
        ...
