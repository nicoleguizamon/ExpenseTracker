using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ExpenseTracker.DataAccess.Configuration;
using ExpenseTracker.Model;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ExpenseTracker.DataAccess
{
    public class ExContext : IdentityDbContext, IContext
    {
       
        public ExContext() : base("DefaultConnection")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
            Database.SetInitializer(
                new MigrateDatabaseToLatestVersion<ExContext, GlobalConfiguration>());

        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Configurations
            .Add(new ExpenseConfiguration());
            base.OnModelCreating(modelBuilder);
  
        }
        public DbSet<Expense> Expenses { get; set; }
    }
}
