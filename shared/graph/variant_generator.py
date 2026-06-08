"""
Variant Generator — creates distinct question/option orderings per variant.

Each variant has a unique permutation of question order and option order.
The number of variants equals the chromatic number of the seating graph.
"""


class VariantGenerator:
    """Generate exam variants with shuffled question and option orders."""

    @staticmethod
    def generate_variants(questions: list, num_variants: int, seed: int | None = None) -> list[dict]:
        """
        Generate N distinct variants of the exam.

        Each variant has:
          - Shuffled question order
          - Shuffled option order per question
          - Correct answer index updated

        Returns:
            List of variant dicts: [{ variant_id, questions: [{ id, options, correct }] }]
        """
        # TODO: Implement with seeded random for reproducibility
        ...
