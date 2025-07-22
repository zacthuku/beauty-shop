"""Add amount to Invoice

Revision ID: a6129e1beb49
Revises: 78008927eb9d
Create Date: 2025-07-21 11:54:49.231709
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a6129e1beb49'
down_revision = '78008927eb9d'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: Add column as nullable first
    with op.batch_alter_table('invoices', schema=None) as batch_op:
        batch_op.add_column(sa.Column('amount', sa.Float(), nullable=True))

    # Step 2: Set default value for existing rows
    op.execute("UPDATE invoices SET amount = 0.0")

    # Step 3: Alter column to be NOT NULL
    with op.batch_alter_table('invoices', schema=None) as batch_op:
        batch_op.alter_column('amount', nullable=False)


def downgrade():
    # Drop the 'amount' column
    with op.batch_alter_table('invoices', schema=None) as batch_op:
        batch_op.drop_column('amount')
