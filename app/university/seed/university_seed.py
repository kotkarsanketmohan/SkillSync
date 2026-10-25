def get_seed_course_plan(course_name: str, mode: str) -> dict:
    return {
        "type": "NEW" if mode == "NEW_COURSE" else "MODIFY",
        "course_name": course_name,
        "semester": 7,
        "current_alignment": 40,
        "proposed_alignment": 85,
        "placement_impact": "High",
        "improvement": 45,
        "prerequisites": ["Programming"],
        "add": ["Advanced Topic"],
        "remove": ["Basic Topic"],
        "units": [
            {
                "unit": 1,
                "title": f"Introduction to {course_name}",
                "hours": 6,
                "objectives": ["Understand basics"],
                "modules": ["Module 1", "Module 2"]
            },
            {
                "unit": 2,
                "title": "Core Concepts",
                "hours": 8,
                "objectives": ["Analyze systems"],
                "modules": ["Module 3", "Module 4"]
            }
        ],
        "provider": "SEED",
        "data_mode": "SEEDED_DATA",
        "fallback_used": True
    }
