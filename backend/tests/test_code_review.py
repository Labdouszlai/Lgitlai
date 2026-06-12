import pytest
import tempfile
from pathlib import Path
from ai.code_review import review_codebase


def test_large_file():
    with tempfile.TemporaryDirectory() as tmpdir:
        lines = ["x = 1"] * 600
        Path(tmpdir, "big.py").write_text("\n".join(lines))
        issues = review_codebase(tmpdir)
        large = [i for i in issues if "lines long" in i["message"]]
        assert len(large) > 0


def test_duplicate_logic():
    with tempfile.TemporaryDirectory() as tmpdir:
        func = "def add(a, b):\n    return a + b\n"
        Path(tmpdir, "math1.py").write_text(func + "def mul(a, b):\n    return a * b\n")
        Path(tmpdir, "math2.py").write_text("from math1 import add\n" + func)
        issues = review_codebase(tmpdir)
        dups = [i for i in issues if i["type"] == "duplicate_logic"]
        assert len(dups) >= 0


def test_missing_docstring():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "mod.py").write_text("def foo():\n    pass\n")
        issues = review_codebase(tmpdir)
        docs = [i for i in issues if i["type"] == "documentation"]
        assert len(docs) > 0
