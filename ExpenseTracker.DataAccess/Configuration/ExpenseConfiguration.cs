using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using ExpenseTracker.Model;

namespace ExpenseTracker.DataAccess.Configuration
{
    public class ExpenseConfiguration : EntityTypeConfiguration<Expense>
    {
        public ExpenseConfiguration()
        {
            //TODO: Define required fields
            HasKey(k => k.Id);
            Property(p => p.Id)
            .HasColumnName("Id")
            .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(p => p.Amount).HasColumnName("Amount");
            Property(p => p.Comment).HasColumnName("Comment");
            Property(p => p.Description).HasColumnName("Description");
            Property(p => p.ExpenseDate).HasColumnName("ExpenseDate");
            Property(p => p.UserId).HasColumnName("UserId");
        }
    }
}
