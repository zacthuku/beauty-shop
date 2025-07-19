"""changed password_hash to password

Revision ID: 78008927eb9d
Revises: 15b5cf71c047
Create Date: 2025-07-19 15:33:24.558299
"""

from alembic import op

# revision identifiers, used by Alembic.
revision = '78008927eb9d'
down_revision = '15b5cf71c047'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('users', 'password_hash', new_column_name='password')


def downgrade():
    op.alter_column('users', 'password', new_column_name='password_hash')
