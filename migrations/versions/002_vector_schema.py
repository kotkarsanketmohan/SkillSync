"""vector_schema

Revision ID: 002_vector_schema
Revises: 3b033923f94f
Create Date: 2026-09-18 01:50:40.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector


# revision identifiers, used by Alembic.
revision: str = '002_vector_schema'
down_revision: Union[str, Sequence[str], None] = '3b033923f94f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Attempt to create extension if possible
    try:
        op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    except Exception as e:
        import warnings
        warnings.warn(f"Failed to create vector extension. Vector tables will not be created. Error: {e}")
        return
    
    op.create_table('industry_skills',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('job_id', sa.Integer(), nullable=False),
    sa.Column('skill_name', sa.String(), nullable=False),
    sa.Column('skill_id', sa.Integer(), nullable=True),
    sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(dim=384), nullable=True),
    sa.ForeignKeyConstraint(['job_id'], ['job_descriptions.id'], ),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_industry_skills_id'), 'industry_skills', ['id'], unique=False)
    op.create_index(op.f('ix_industry_skills_skill_name'), 'industry_skills', ['skill_name'], unique=False)
    
    op.create_table('curriculum_skills',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.Column('skill_name', sa.String(), nullable=False),
    sa.Column('skill_id', sa.Integer(), nullable=True),
    sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(dim=384), nullable=True),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ),
    sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_curriculum_skills_id'), 'curriculum_skills', ['id'], unique=False)
    op.create_index(op.f('ix_curriculum_skills_skill_name'), 'curriculum_skills', ['skill_name'], unique=False)
    
    op.create_table('matching_details',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('result_id', sa.Integer(), nullable=False),
    sa.Column('industry_skill_id', sa.Integer(), nullable=True),
    sa.Column('dataset_skill_id', sa.Integer(), nullable=True),
    sa.Column('curriculum_skill_id', sa.Integer(), nullable=False),
    sa.Column('similarity', sa.Float(), nullable=False),
    sa.Column('industry_demand', sa.Float(), nullable=True),
    sa.Column('weighted_contribution', sa.Float(), nullable=True),
    sa.Column('match_status', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['curriculum_skill_id'], ['curriculum_skills.id'], ),
    sa.ForeignKeyConstraint(['dataset_skill_id'], ['industry_dataset_skills.id'], ),
    sa.ForeignKeyConstraint(['industry_skill_id'], ['industry_skills.id'], ),
    sa.ForeignKeyConstraint(['result_id'], ['matching_results.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_matching_details_id'), 'matching_details', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_matching_details_id'), table_name='matching_details')
    op.drop_table('matching_details')
    
    op.drop_index(op.f('ix_curriculum_skills_skill_name'), table_name='curriculum_skills')
    op.drop_index(op.f('ix_curriculum_skills_id'), table_name='curriculum_skills')
    op.drop_table('curriculum_skills')
    
    op.drop_index(op.f('ix_industry_skills_skill_name'), table_name='industry_skills')
    op.drop_index(op.f('ix_industry_skills_id'), table_name='industry_skills')
    op.drop_table('industry_skills')
